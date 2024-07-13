import { Request } from "express";
import { PersonalPayload } from "./personalPayload";

export interface AuthRequest extends Request {
    personalData?: PersonalPayload;
    direction?: string; // Agregar dirección como propiedad opcional
}
