import { ReportRepository } from "../repositories/ReportRepositorie";
import { DateUtils } from "../../shared/utils/Date";
import { Report } from "../models/Report";


export class alumnService {

    public static async getAllReports(): Promise<Report[]> {
        try{
            return await ReportRepository.findAll();
        }catch (error: any){
            throw new Error(`Error al obtener alumnos: ${error.message}`);
        }
    }

    public static async getReportId(employeeId: number): Promise<Report | null> {
        try{
            return await ReportRepository.findById(employeeId);

        }catch (error: any){
            throw new Error(`Error al encontrar alumno: ${error.message}`);
        }
    }

    public static async addReport(report: Report) {
        try {
            report.created_at = DateUtils.formatDate(new Date());
            report.updated_at = DateUtils.formatDate(new Date());
            return await ReportRepository.createReport(report);
        } catch (error: any) {
            throw new Error(`Error al crear alumno: ${error.message}`);
        }
    }

    public static async modifyReport(reportId: number, reportData: Report){
        try{
            const reportFinded =  await ReportRepository.findById(reportId);
    
            if(reportFinded){
                if(reportData.topic){
                    reportFinded.topic = reportData.topic;
                }
                if(reportData.deleted){
                    reportFinded.deleted = reportData.deleted;
                }
            }else{
                return null;
            }
            reportFinded.updated_by = reportData.updated_by
            reportFinded.updated_at = DateUtils.formatDate(new Date());
            return await ReportRepository.updateReport(reportId, reportFinded);
        }catch (error: any){
            throw new Error(`Error al modificar alumno: ${error.message}`);
        }
    }

    public static async deletReport(report_id: number): Promise<boolean> {
        try{
            return await ReportRepository.deleteReport(report_id);

        }catch (error: any){
            throw new Error(`Error al eliminar alumno: ${error.message}`);
        }
    }

}