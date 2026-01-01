import api from "@/services/api";

export const createLookAhead = (data) => 
    api.post("/lookahead/", data);

export const getLookAhead = (id) =>
    api.get(`/lookahead/${id}/`);

export const siteLeadApprove = (id) => 
    api.patch(`/lookahead/${id}/site-lead/approve/`);

export const siteLeadReject = (id) => 
    api.patch(`/lookahead/${id}/site-lead/reject/`);

export const procurementApprove = (id) => 
    api.patch(`/lookahead/${id}/procurement/approve/`);

export const procurementReject = (id, comment) => 
    api.patch(`/lookahead/${id}/procurement/reject/`);