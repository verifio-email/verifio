/**
 * Role-Based Email Prefixes Database
 * These are generic/functional email addresses, not personal ones
 */

export const ROLE_PREFIXES: Map<string, string> = new Map([
  // Business/Support
  ["info", "General Information"],
  ["contact", "Contact"],
  ["hello", "Contact"],
  ["hi", "Contact"],
  ["support", "Support"],
  ["help", "Support"],
  ["helpdesk", "Support"],
  ["customerservice", "Customer Service"],
  ["customer-service", "Customer Service"],
  ["customercare", "Customer Care"],
  ["customer-care", "Customer Care"],
  ["service", "Service"],

  // Sales/Marketing
  ["sales", "Sales"],
  ["marketing", "Marketing"],
  ["advertise", "Advertising"],
  ["advertising", "Advertising"],
  ["ads", "Advertising"],
  ["press", "Press"],
  ["media", "Media"],
  ["pr", "Public Relations"],
  ["partnerships", "Partnerships"],
  ["partner", "Partnerships"],
  ["partners", "Partnerships"],
  ["affiliate", "Affiliate"],
  ["affiliates", "Affiliate"],
  ["sponsors", "Sponsors"],
  ["sponsorship", "Sponsors"],

  // Technical
  ["admin", "Administrator"],
  ["administrator", "Administrator"],
  ["sysadmin", "System Administrator"],
  ["root", "Root"],
  ["webmaster", "Webmaster"],
  ["hostmaster", "Hostmaster"],
  ["postmaster", "Postmaster"],
  ["abuse", "Abuse"],
  ["security", "Security"],
  ["tech", "Technical"],
  ["technical", "Technical"],
  ["it", "IT"],
  ["devops", "DevOps"],
  ["ops", "Operations"],
  ["noc", "NOC"],
  ["dns", "DNS"],
  ["ftp", "FTP"],
  ["ssl", "SSL"],
  ["www", "Web"],
  ["web", "Web"],
  ["api", "API"],

  // No-Reply
  ["noreply", "No Reply"],
  ["no-reply", "No Reply"],
  ["donotreply", "Do Not Reply"],
  ["do-not-reply", "Do Not Reply"],
  ["bounce", "Bounce"],
  ["bounces", "Bounce"],
  ["mailer-daemon", "Mailer Daemon"],
  ["mailerdaemon", "Mailer Daemon"],
  ["daemon", "Daemon"],

  // Departments
  ["hr", "Human Resources"],
  ["humanresources", "Human Resources"],
  ["human-resources", "Human Resources"],
  ["jobs", "Jobs"],
  ["careers", "Careers"],
  ["recruiting", "Recruiting"],
  ["recruitment", "Recruiting"],
  ["hiring", "Hiring"],
  ["finance", "Finance"],
  ["accounting", "Accounting"],
  ["accounts", "Accounts"],
  ["billing", "Billing"],
  ["payments", "Payments"],
  ["invoices", "Invoices"],
  ["legal", "Legal"],
  ["compliance", "Compliance"],
  ["privacy", "Privacy"],
  ["gdpr", "GDPR"],

  // General/Team
  ["team", "Team"],
  ["office", "Office"],
  ["general", "General"],
  ["enquiries", "Enquiries"],
  ["inquiries", "Inquiries"],
  ["enquiry", "Enquiry"],
  ["inquiry", "Inquiry"],
  ["feedback", "Feedback"],
  ["suggestions", "Suggestions"],
  ["complaints", "Complaints"],
  ["orders", "Orders"],
  ["order", "Orders"],
  ["reservations", "Reservations"],
  ["booking", "Booking"],
  ["bookings", "Booking"],
  ["subscribe", "Subscribe"],
  ["unsubscribe", "Unsubscribe"],
  ["newsletter", "Newsletter"],
  ["news", "News"],
  ["updates", "Updates"],
  ["notifications", "Notifications"],
  ["alerts", "Alerts"],

  // Test/Development
  ["test", "Test"],
  ["testing", "Test"],
  ["demo", "Demo"],
  ["example", "Example"],
  ["sample", "Sample"],
  ["dev", "Development"],
  ["development", "Development"],
  ["staging", "Staging"],
  ["prod", "Production"],
  ["production", "Production"],

  // Misc
  ["all", "All"],
  ["everyone", "Everyone"],
  ["staff", "Staff"],
  ["employees", "Employees"],
  ["members", "Members"],
  ["users", "Users"],
  ["community", "Community"],
  ["moderator", "Moderator"],
  ["moderators", "Moderator"],
  ["admin", "Admin"],
  ["admins", "Admin"],
]);

/**
 * Check if an email prefix is role-based
 */
export function isRolePrefix(prefix: string): boolean {
  return ROLE_PREFIXES.has(prefix.toLowerCase());
}

/**
 * Get the role name for a prefix
 */
export function getRoleName(prefix: string): string | undefined {
  return ROLE_PREFIXES.get(prefix.toLowerCase());
}

/**
 * Get the count of role prefixes in database
 */
export function getRolePrefixCount(): number {
  return ROLE_PREFIXES.size;
}
