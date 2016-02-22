import { IBaseService} from "./service.interface";

interface ITitleBadge {
    color: string;
    icon?: string;
    tooltip?: string;
    description?: string;
    show?: boolean;
}

interface ITitleBadges extends IBaseService {
    badges: { [index: number]: ITitleBadge };
    clearBadges(): void;
}

export {ITitleBadge,ITitleBadges}