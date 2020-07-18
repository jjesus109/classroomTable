import { TimeTable as TT } from "./timetable.model";
export interface Classroom{
    IdClassroom?:string,
    Name:string;
    TimeTable:Array<TT>;
}