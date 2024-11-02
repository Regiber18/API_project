import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('Error:', err.stack);

  // Manejo del error y respuesta adecuada al cliente
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message // Mensaje específico del error que se envía al cliente
  
  })};