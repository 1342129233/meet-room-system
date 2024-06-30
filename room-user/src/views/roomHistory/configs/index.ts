export enum StatusEnum {
    APPLY = 1,
    THROUGH = 2,
    DENIED = 3,
    RELIEVE = 4
}

export const StatusMap = {
    [StatusEnum.APPLY]: '申请中',
    [StatusEnum.THROUGH]: '审批通过',
    [StatusEnum.DENIED]: '审批驳回',
    [StatusEnum.RELIEVE]: '已解除'
}