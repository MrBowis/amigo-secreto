import os
import sys
import joblib
import glob

# Configuración de umbral (opcional, ajusta según tu modelo)
UMBRAL_PROBABILIDAD = 50.0 

print("📦 Cargando modelo y vectorizador guardados...")

try:
    # Asegúrate de que los archivos .pkl estén en la raíz o ajusta la ruta
    model_cargado = joblib.load('modelo_xgb_seguridad.pkl')
    vectorizer_cargado = joblib.load('vectorizador_tfidf.pkl')
    print("✅ Modelo y Vectorizador cargados exitosamente")
except Exception as e:
    print(f"❌ Error al cargar los modelos: {e}")
    sys.exit(1)

def probar_codigo(codigo, archivo):
    """
    Prueba el contenido de un archivo contra el modelo.
    """
    try:
        # Vectorizar
        X_test = vectorizer_cargado.transform([codigo])
        
        # Predicción
        pred = model_cargado.predict(X_test)[0]
        prob = model_cargado.predict_proba(X_test)[0]
        
        prob_vulnerable = prob[1] * 100
        
        # Lógica de decisión
        es_vulnerable = pred == 1
        
        return es_vulnerable, prob_vulnerable
    except Exception as e:
        print(f"⚠️ Error procesando el archivo {archivo}: {e}")
        return False, 0.0

def escanear_directorio():
    archivos_vulnerables = []
    # Busca recursivamente archivos .ts y .tsx (ignora node_modules)
    files = glob.glob('**/*.ts', recursive=True) + glob.glob('**/*.tsx', recursive=True)
    
    files = [f for f in files if 'node_modules' not in f and '.next' not in f]

    print(f"🔍 Analizando {len(files)} archivos TypeScript...\n")

    for file_path in files:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            contenido = f.read()
            
            # Si el archivo está vacío, saltar
            if not contenido.strip():
                continue

            es_vuln, prob = probar_codigo(contenido, file_path)

            if es_vuln:
                print(f"🔴 VULNERABLE DETECTADO: {file_path}")
                print(f"   Probabilidad: {prob:.2f}%")
                archivos_vulnerables.append({
                    'archivo': file_path,
                    'probabilidad': prob
                })
            else:
                # Opcional: imprimir archivos seguros para depuración
                # print(f"🟢 SEGURO: {file_path}")
                pass

    return archivos_vulnerables

if __name__ == "__main__":
    vulnerables = escanear_directorio()

    if vulnerables:
        print("\n" + "="*50)
        print(f"❌ REPORTE DE SEGURIDAD: {len(vulnerables)} archivos vulnerables encontrados.")
        print("="*50)
        # Generar un reporte para el comentario del PR
        with open("security_report.txt", "w") as f:
            f.write("### 🚨 Alerta de Seguridad: Código Vulnerable Detectado\n\n")
            f.write("| Archivo | Probabilidad |\n")
            f.write("|---------|--------------|\n")
            for v in vulnerables:
                f.write(f"| `{v['archivo']}` | {v['probabilidad']:.2f}% |\n")
        
        # Salir con error para detener el pipeline
        sys.exit(1) 
    else:
        print("\n✅ Análisis completado: Código Seguro.")
        sys.exit(0)