import { Users } from './users.model';

export interface TimeTable{
    From:string,
    To:string,
    Users:Array<string>
}