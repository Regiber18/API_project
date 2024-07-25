import { Response, Request } from "express"
import { roleService } from "../services/RoleServices"

export const getRoleAll = async (_req: Request, res: Response) => {
  try {
    const role = await roleService.getAllRoles()

    if(role) {
      res.status(201).json(role)
    }else {
      res.status(404).json(role)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getRoles = async (_req: Request, res: Response) => {
  try {
    const role = await roleService.getRolesAct()

    if(role) {
      res.status(201).json(role)
    }else {
      res.status(404).json(role)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getRoleId = async (req: Request, res: Response) => {
  try {
    const role = await roleService.getRoleId(parseInt(req.params.personal_id, 10))

    if(role) {
      res.status(201).json(role)
    }else {
      res.status(404).json(role)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const createRole = async (req: Request, res: Response) => {
  try {
    const role = await roleService.addRole(req.body);

    if(role){
      res.status(201).json(role);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const  updateRole = async (req: Request, res: Response) => {
  try {
    const role = await roleService.modifyRole(parseInt(req.params.personal_id, 10), req.body);

    if(role){
      res.status(201).json(role);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const role = await roleService.deleteRole(parseInt(req.params.personal_id, 10));

    if(role) {
      res.status(201).json({message: "salio bien"})
    }else {
      res.status(404).json({message: "algo salio mal"});
    }
  }catch(eer: any) {
    res.status(500)
  }
}

