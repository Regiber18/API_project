import { Router } from "express";
import { getRoleAll, getRoleId, createRole, deleteRole, updateRole} from "../controllers/RoleController"

const roleRoutes: Router = Router();

roleRoutes.get('/', getRoleAll);
roleRoutes.get('/:role_id', getRoleId)
roleRoutes.post('/', createRole); 
roleRoutes.put('/:role_id', updateRole)
roleRoutes.delete('/:role_id', deleteRole)

export default roleRoutes;