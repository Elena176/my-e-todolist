import {TodolistType} from '../../api/types';
import {RequestStatusType} from '../../app';

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
