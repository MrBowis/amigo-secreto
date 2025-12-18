describe('Validaciones de Email', () => {
  const validarEmail = (email: string): boolean => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

  describe('Emails válidos', () => {
    const emailsValidos = [
      'usuario@example.com',
      'user.name@example.com',
      'user+tag@example.co.uk',
      'usuario123@subdomain.example.com',
      'test_email@example.org',
    ];

    emailsValidos.forEach((email) => {
      it(`debería aceptar: ${email}`, () => {
        expect(validarEmail(email)).toBe(true);
      });
    });
  });

  describe('Emails inválidos', () => {
    const emailsInvalidos = [
      'usuario@',
      'usuario@.com',
      'usuario.com',
      '@example.com',
      'usuario@example',
      'usuario @example.com',
      'usuario@@example.com',
      '',
      'usuario@exam ple.com',
    ];

    emailsInvalidos.forEach((email) => {
      it(`debería rechazar: ${email || '(vacío)'}`, () => {
        expect(validarEmail(email)).toBe(false);
      });
    });
  });
});

describe('Validaciones de URL', () => {
  const validarURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  describe('URLs válidas', () => {
    const urlsValidas = [
      'https://amazon.com',
      'https://www.amazon.com/producto',
      'https://example.com/path?query=value',
      'http://localhost:3000',
      'https://subdomain.example.org',
    ];

    urlsValidas.forEach((url) => {
      it(`debería aceptar: ${url}`, () => {
        expect(validarURL(url)).toBe(true);
      });
    });
  });

  describe('URLs inválidas', () => {
    const urlsInvalidas = [
      'not a url',
      'amazon.com',
      'www.example.com',
      '',
      'ftp://',
      'http://',
    ];

    urlsInvalidas.forEach((url) => {
      it(`debería rechazar: ${url || '(vacío)'}`, () => {
        expect(validarURL(url)).toBe(false);
      });
    });
  });
});

describe('Validaciones de Contraseña', () => {
  const validarContrasena = (password: string): boolean => {
    return password.length >= 6;
  };

  describe('Contraseñas válidas', () => {
    const contrasenasValidas = [
      'password123',
      '123456',
      'MyP@ssw0rd',
      'VeryLongPasswordString123',
    ];

    contrasenasValidas.forEach((pwd) => {
      it(`debería aceptar: ${pwd}`, () => {
        expect(validarContrasena(pwd)).toBe(true);
      });
    });
  });

  describe('Contraseñas inválidas', () => {
    const contrasenasInvalidas = [
      'pass',
      '12345',
      'ab',
      '',
      ' ',
    ];

    contrasenasInvalidas.forEach((pwd) => {
      it(`debería rechazar: ${pwd || '(vacío)'}`, () => {
        expect(validarContrasena(pwd)).toBe(false);
      });
    });
  });
});

describe('Validaciones de Nombre', () => {
  const validarNombre = (nombre: string): boolean => {
    return nombre.trim().length > 0 && nombre.length <= 100;
  };

  describe('Nombres válidos', () => {
    const nombresValidos = [
      'Juan',
      'María García López',
      'José María',
      'A',
      'Juan Pablo Pérez González Martínez',
    ];

    nombresValidos.forEach((nombre) => {
      it(`debería aceptar: ${nombre}`, () => {
        expect(validarNombre(nombre)).toBe(true);
      });
    });
  });

  describe('Nombres inválidos', () => {
    const nombresInvalidos = [
      '',
      '   ',
      'a'.repeat(101),
    ];

    nombresInvalidos.forEach((nombre) => {
      it(`debería rechazar: ${nombre || '(vacío)'}`, () => {
        expect(validarNombre(nombre)).toBe(false);
      });
    });
  });
});
