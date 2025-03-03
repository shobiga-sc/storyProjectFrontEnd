export interface Report{
    id?: string;
    reportedByUserId?: string;
    reportedAuthorId?: string;
    reportedStoryId?: string;
    isStoryDeleted?: boolean;  
    isUserDeleted?: boolean;   
    reason?: string;
    isReportAccepted?: boolean;
    reportedAt?: Date;
}