interface IBadge {
    color: string;
    icon: string;
    text?: string;
    tooltip?: string;
    show?: boolean;
}

export enum BadgeType {
    Editmode,
    Newmode,
    Invalid,
    Dirty,
    Recordcount,
    Selectedcount
}

export {IBadge}