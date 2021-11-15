const schedule = require('node-schedule')
/**
 * 排程
 */
export default class ScheduleManager {
    public static getUse(): void {
        var taskFreq = "0 0 * * *";
        schedule.scheduleJob(taskFreq, () => {
       
        })
    }
}