import { Response, Request } from "express"
import { productService } from "../services/productService"

export const getAlumnAll = async (_req: Request, res: Response) => {
    try {
        const alumns = await productService.getAllProducts()
        if (alumns) {
            res.status(201).json(alumns)
        } else {
            res.status(404).json(alumns)
        }
    } catch (err: any) {
        res.status(500).json({ erro: err.message })
    }
}

export const getAllEventsStatus = async (_req: Request, res: Response) => {
    try {
        const alumns = await productService.getAllEventsStatus()
        if (alumns) {
            res.status(201).json(alumns)
        } else {
            res.status(404).json(alumns)
        }
    } catch (err: any) {
        res.status(500).json({ erro: err.message })
    }
}

export const getEventAllWith = async (_req: Request, res: Response) => {
    try {
        const alumns = await productService.getAllEventsWith()
        if (alumns) {
            res.status(201).json(alumns)
        } else {
            res.status(404).json(alumns)
        }
    } catch (err: any) {
        res.status(500).json({ erro: err.message })
    }
}




export const createProduct = async (req: Request, res: Response) => {
    try {
        const newEmployee = await productService.addAlumn(req.body);
        if (newEmployee) {
            res.status(201).json(newEmployee);
        } else {
            res.status(404).json({ message: 'Algo salio mal' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const createEventPerson = async (req: Request, res: Response) => {
    try {
        const newEmployee = await productService.addEventPerson(req.body);

        if (newEmployee) {
            res.status(201).json(newEmployee);
        } else {
            res.status(404).json({ message: 'No se pudo agregar la persona al evento. El evento podría estar lleno.' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const restEventPerson = async (req: Request, res: Response) => {
    try {
        const newEmployee = await productService.restEventPerson(req.body);

        if (newEmployee) {
            res.status(201).json(newEmployee);
        } else {
            res.status(404).json({ message: 'No se pudo agregar la persona al evento. El evento podría estar lleno.' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}


export const findByNameModify = async (req: Request, res: Response) => {
    try {
        const findedName = await productService.findByNameModify(req.params.name);
        if (findedName) {
            res.status(201).json(findedName)
        } else {
            res.status(404).json(findedName)
        }
    } catch (error: any) {
        res.status(404).json({ message: `error` })
    }
}
export const findByTypeGameModify = async (req: Request, res: Response) => {
    try {
        const findedName = await productService.findByTypeGame(req.params.type_game);
        if (findedName) {
            res.status(201).json(findedName)
        } else {
            res.status(404).json(findedName)
        }
    } catch (error: any) {
        res.status(404).json({ message: `error` })
    }
}

export const findGameType = async (req: Request, res: Response) => {
    const name = req.params.name || undefined; // Extract the name parameter
    const typeGame = req.params.type_game || undefined; // Extract the type_game parameter

    try {
        const foundGame = await productService.findByNameType(name, typeGame); // Call the search function
        
        if (foundGame) {
            res.status(200).json(foundGame); // Return the found game with status 200
        } else {
            res.status(404).json({ message: "Game not found." }); // Return a not found message
        }
    } catch (error: any) {
        console.error("Error in findGameType:", error); // Log the error for debugging
        res.status(500).json({ message: "An error occurred." }); // Return a server error message
    }
};



export const findEventAllId = async (req: Request, res: Response) => {
    try {
        const findedName = await productService.findEventAllId(parseInt(req.params.id_personal, 10));
        console.log(parseInt(req.params.id_personal))
        if (findedName) {
            console.log("ok")
            res.status(201).json(findedName)
        } else {
            console.log("I")
            res.status(404).json(findedName)
        }
    } catch (error: any) {
        res.status(404).json({ message: `error` })
    }
}

export const updateALumn = async (req: Request, res: Response) => {
    try {
        const updatedEmployee = await productService.modifyProduct(req.params.game, req.body);
        if (updatedEmployee) {
            res.status(201).json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Algo salio mal' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


/*
export const updateStockProduct = async (req: Request, res: Response) => {
    try {
        const updateData = req.body;


        if (!Array.isArray(updateData) || updateData.length === 0) {
            return res.status(400).json({ message: 'Datos de entrada inválidos' });
        }

        // Llamar al servicio para actualizar el stock
        const updatedProducts = await productService.updateStock(updateData);

        if (updatedProducts && updatedProducts.length > 0) {
            res.status(200).json(updatedProducts);
        } else {
            res.status(404).json({ message: 'No se encontraron productos para actualizar' });
        }
    } catch (error: any) {
        console.error('Error al actualizar el stock:', error.message);
        res.status(500).json({ error: error.message });
    }
};

*/

export const deleteAlumn = async (req: Request, res: Response) => {
    try {
        const deleted = await productService.deletProduct(req.params.name);

        if (deleted) {
            res.status(201).json({ message: "salio bien" })
        } else {
            res.status(404).json({ message: "algo salio mal" });
        }
    } catch (eer: any) {
    }
}

export const deleteEventI = async (req: Request, res: Response) => {
    try {
        const deleted = await productService.deleteEventI(parseInt(req.params.id_personal), parseInt(req.params.id_event));

        if (deleted) {
            res.status(201).json({ message: "salio bien" })
        } else {
            res.status(404).json({ message: "algo salio mal" });
        }
    } catch (eer: any) {
    }
}

