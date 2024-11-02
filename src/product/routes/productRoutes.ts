import { Router } from "express"
import { getAlumnAll, createProduct, getEventAllWithStatus ,getAllEventsStatus,findByTypeGameModify,updateALumn, deleteEventI,deleteAlumn, findByNameModify, createEventPerson, findGameType, restEventPerson, getEventAllWith, findEventAllId } from "../controllers/productController";

const routes: Router = Router();

routes.get('/', getAlumnAll);

/*
routes.get('/find/:name/:brand', getAlumnName)*/
routes.get('/getName')
routes.get("/end",getAllEventsStatus)
routes.post('/addevent', createEventPerson)
routes.delete('/rest', restEventPerson)
routes.post('/', createProduct)
routes.get('/e/:id_personal', findEventAllId)
routes.get('/eventAll', getEventAllWith)
routes.get('/eventAllStatus', getEventAllWithStatus)
routes.delete('/delete/:id_personal/:id_event', deleteEventI)
/*
routes.put('/updateAmount', updateStockProduct)
*/
routes.get('/find/:name', findByNameModify )
routes.get('/findtype/:type_game', findByTypeGameModify)
routes.put('/update/:game', updateALumn)
routes.get('/find/:name?/:type_game?', findGameType);
routes.delete('/:name/:brand', deleteAlumn)

export default routes;