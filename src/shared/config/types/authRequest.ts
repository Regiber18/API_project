import { Request } from "express";
import { PersonalPayload } from "./personalPayload";

export interface AuthRequest extends Request {
    employeeData?: PersonalPayload;
}