import os
import sys
import joblib
import glob
import re

# ==============================================================================
# CONFIGURACIÓN
# ==============================================================================
# Lista de patrones que suelen activar vulnerabilidades en modelos de seguridad (Next.js/Node/General)
# Estos son heurísticos para ayudar al humano a encontrar el error detectado por la IA.
PATRONES_PELIGROSOS = [
    (r'dangerouslySetInnerHTML', 'Posible XSS (React/Next.js)'),
    (r'eval\(', 'Ejecución dinámica de código (Inyección)'),
    (r'exec\(', 'Ejecución de comandos del sistema'),
    (r'subprocess\.', 'Ejecución de subprocesos inseguros'),
    (r'child_process', 'Ejecución de procesos Node.js'),
    (r'\.query\(.*\+.*', 'Posible Inyección SQL (Concatenación de strings)'),
    (r'innerHTML', 'Manipulación directa del DOM (XSS)'),
    (r'document\.write', 'Escritura insegura en DOM'),
    (r'bypassSecurityTrust', 'Salto de sanitización (Angular/General)'),
    (r'no-sanit', 'Desactivación de sanitización'),
    (r'token', 'Posible exposición de secretos (Hardcoded token)'),
    (r'password', 'Posible credencial en código'),
    (r'secret', 'Posible secreto en código')
]

print("📦 Cargando modelo y vectorizador guardados...")

try:
    model_cargado = joblib.load('modelo_xgb_seguridad.pkl')
    vectorizer_cargado = joblib.load('vectorizador_tfidf.pkl')
    print("✅ Modelos cargados exitosamente")
except Exception as e:
    print(f"❌ Error al cargar los modelos: {e}")
    sys.exit(1)

def identificar_lineas_sospechosas(codigo):
    """
    Si el modelo dice que es vulnerable, esta función busca DÓNDE puede estar el problema.
    Retorna una lista de strings con formato "Línea X: Código... [Motivo]"
    """
    hallazgos = []
    lineas = codigo.split('\n')
    
    for i, linea in enumerate(lineas):
        linea_num = i + 1
        contenido_linea = linea.strip()
        
        # Saltamos líneas muy cortas o comentarios simples
        if len(contenido_linea) < 4 or contenido_linea.startswith('//'):
            continue

        for patron, motivo in PATRONES_PELIGROSOS:
            if re.search(patron, contenido_linea, re.IGNORECASE):
                # Cortamos la línea si es muy larga para el reporte
                texto_muestra = (contenido_linea[:70] + '...') if len(contenido_linea) > 70 else contenido_linea
                hallazgos.append(f"   ⚠️  Línea {linea_num}: {texto_muestra} -> [{motivo}]")
                break # Si encontramos un motivo en la línea, pasamos a la siguiente línea
                
    return hallazgos

def probar_codigo(codigo, archivo):
    try:
        # 1. Análisis de IA (El que manda)
        X_test = vectorizer_cargado.transform([codigo])
        pred = model_cargado.predict(X_test)[0]
        prob = model_cargado.predict_proba(X_test)[0]
        prob_vulnerable = prob[1] * 100
        
        es_vulnerable = pred == 1
        
        return es_vulnerable, prob_vulnerable
    except Exception as e:
        print(f"⚠️ Error procesando modelo en {archivo}: {e}")
        return False, 0.0

def escanear_directorio():
    archivos_vulnerables = []
    
    # Extensiones a analizar para Next.js/Typescript
    files = glob.glob('**/*.ts', recursive=True) + \
            glob.glob('**/*.tsx', recursive=True) + \
            glob.glob('**/*.js', recursive=True) + \
            glob.glob('**/*.jsx', recursive=True)
    
    # Filtrar carpetas que no son código fuente
    files = [f for f in files if 'node_modules' not in f and '.next' not in f and '.git' not in f]

    print(f"🔍 Analizando {len(files)} archivos de código fuente...\n")

    reporte_texto = ""

    for file_path in files:
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                contenido = f.read()
                
            if not contenido.strip():
                continue

            es_vuln, prob = probar_codigo(contenido, file_path)

            if es_vuln:
                print(f"🔴 VULNERABLE: {file_path} (Prob: {prob:.2f}%)")
                
                # Si la IA dice vulnerable, buscamos las líneas para ayudar al usuario
                detalles_lineas = identificar_lineas_sospechosas(contenido)
                
                info_vulnerabilidad = {
                    'archivo': file_path,
                    'probabilidad': prob,
                    'lineas': detalles_lineas
                }
                archivos_vulnerables.append(info_vulnerabilidad)
                
                # Imprimimos en consola las líneas detectadas
                for detalle in detalles_lineas:
                    print(detalle)
                print("-" * 40)

        except Exception as e:
            print(f"Error leyendo archivo {file_path}: {e}")

    return archivos_vulnerables

if __name__ == "__main__":
    vulnerables = escanear_directorio()

    if vulnerables:
        print("\n" + "="*60)
        print(f"❌ REPORTE DE SEGURIDAD: {len(vulnerables)} archivos vulnerables encontrados.")
        print("="*60)
        
        # Generar reporte detallado para el Pull Request
        with open("security_report.txt", "w", encoding="utf-8") as f:
            f.write("### 🚨 Alerta de Seguridad: Código Vulnerable Detectado\n\n")
            f.write("El modelo de IA ha detectado patrones peligrosos con alta probabilidad.\n\n")
            
            for v in vulnerables:
                f.write(f"#### 📄 Archivo: `{v['archivo']}`\n")
                f.write(f"**Probabilidad de Riesgo:** {v['probabilidad']:.2f}%\n")
                
                if v['lineas']:
                    f.write("\n**🔍 Posibles líneas afectadas (Detección heurística):**\n")
                    f.write("```typescript\n")
                    for linea in v['lineas']:
                        f.write(f"{linea}\n")
                    f.write("```\n")
                else:
                    f.write("\n> ⚠️ La IA clasificó este archivo como peligroso por su estructura general, pero no se detectaron palabras clave específicas. Revisar lógica compleja.\n")
                
                f.write("\n---\n")
        
        # Salir con código 1 para bloquear el PR
        sys.exit(1) 
    else:
        print("\n✅ Análisis completado: Código Seguro.")
        sys.exit(0)