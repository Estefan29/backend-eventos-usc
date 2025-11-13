import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

// 🔹 Registrar usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { correo, contrasena, nombre, apellido, rol, tipo_usuario } = req.body;

    if (!correo || !contrasena || !nombre || !apellido || !rol) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    const existe = await prisma.usuario.findUnique({ where: { correo } });
    if (existe) return res.status(400).json({ mensaje: "El correo ya está registrado" });

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        correo,
        contrasena: hashedPassword,
        nombre,
        apellido,
        rol,
        tipo_usuario,
      },
    });

    res.status(201).json({ mensaje: "Usuario registrado exitosamente", usuario: nuevoUsuario });
  } catch (error) {
    console.error(" Error al registrar usuario:", error);
    res.status(500).json({ mensaje: "Error al registrar usuario", error: error.message });
  }
};

// 🔹 Login de usuario
export const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: "Debe proporcionar correo y contraseña" });
    }

    const usuario = await prisma.usuario.findUnique({ where: { correo } });
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const validarPassword = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!validarPassword) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    // Generar token
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET || "supersecreto",
      { expiresIn: "8h" }
    );

    res.json({
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
        correo: usuario.correo,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión", error: error.message });
  }
};
