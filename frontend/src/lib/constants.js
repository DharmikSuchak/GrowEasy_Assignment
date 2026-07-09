/**
 * CRM field definitions and constants used across the frontend.
 */

export const CRM_FIELDS = [
  { key: "created_at", label: "Created At" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "country_code", label: "Code" },
  { key: "mobile_without_country_code", label: "Mobile" },
  { key: "company", label: "Company" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
  { key: "lead_owner", label: "Lead Owner" },
  { key: "crm_status", label: "Status" },
  { key: "crm_note", label: "Notes" },
  { key: "data_source", label: "Source" },
  { key: "possession_time", label: "Possession" },
  { key: "description", label: "Description" },
];

export const STATUS_STYLES = {
  GOOD_LEAD_FOLLOW_UP: { label: "Follow Up", className: "badge-success" },
  DID_NOT_CONNECT: { label: "No Connect", className: "badge-warning" },
  BAD_LEAD: { label: "Bad Lead", className: "badge-error" },
  SALE_DONE: { label: "Sale Done", className: "badge-info" },
};

export const STEPS = [
  { id: 1, label: "Upload CSV" },
  { id: 2, label: "Preview Data" },
  { id: 3, label: "Processing" },
  { id: 4, label: "Results" },
];

export const FILE_CONSTRAINTS = {
  maxSizeBytes: 10 * 1024 * 1024, // 10 MB
  maxSizeLabel: "10 MB",
  acceptedTypes: ".csv",
  acceptedMimeTypes: [
    "text/csv",
    "application/vnd.ms-excel",
    "text/plain",
  ],
};
