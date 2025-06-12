// item.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

@Entity('suggestion_item_master')
export class SuggestionItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 45 })
    item_name: string;

    @Column({ length: 45 })
    category: string;

    @Column({ length: 45 })
    sub_category: string;
}
