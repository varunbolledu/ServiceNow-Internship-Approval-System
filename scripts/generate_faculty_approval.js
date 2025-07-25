1. Business Rule: Generate Faculty Approval for Internship Request
Purpose: Triggers on new request submission (after insert), sets initial statuses, creates the Faculty approval record, and fires an event for notifications.
Table: Internship Request (e.g., x_1729782_internsh_internship_request)
When to run: after insert (no update checked, no Filter Conditions)
    
    code:
    (function executeRule(current, previous /*null rule for after rules*/) {

    // --- PART 1: Set Initial Statuses ---
    // These updates happen immediately upon record insertion
    current.status = 'submitted'; // Set status to Submitted first
    current.update(); // Update the record to save 'submitted' status

    // Now set status to In Review (triggers Faculty approval)
    current.status = 'in_review'; // Set status to In Review
    current.update(); // Update the record again to save 'in_review' status

    // --- PART 2: Create Approval Record for Faculty ---

    var grApproval = new GlideRecord('sysapproval_approver');
    grApproval.initialize();
    
    // Set the Approver - IMPORTANT: Use the User ID of your faculty.test user (e.g., 'faculty.test')
    grApproval.approver = gs.getUserIDByUserName('faculty.test'); 
    
    // Link the approval to the Internship Request record
    grApproval.document_id = current.sys_id;
    grApproval.document_table = current.getTableName(); // Gets the backend name of your Internship Request table

    // Set the initial state of the approval record
    grApproval.state = 'requested';

    // Set a short description for the approval task
    // IMPORTANT: Replace 'internship_title' with your exact backend name for Internship Title (e.g., current.internship_title)
    grApproval.short_description = 'Approve Internship Request: ' + current.internship_title; 
    
    // Insert the new approval record
    var newApprovalSysId = grApproval.insert(); 
    if (newApprovalSysId) {
        gs.info('BR: Approval record created successfully! Sys ID: ' + newApprovalSysId, 'DEBUG_APPROVAL');
    } else {
        gs.info('BR: FAILED to create approval record! Insert returned NULL. Approver ID: ' + grApproval.approver, 'DEBUG_APPROVAL');
    }
    
    // Optionally, add a message to the Internship Request record's Activity stream
    current.comments = 'Approval requested from Faculty.'; 

    // *** Fire the event for the notification (used for "Internship Request Submitted" notification) ***
    // IMPORTANT: Ensure 'x_1729782_internsh.request.submitted' matches your exact event name
    gs.eventQueue('x_1729782_internsh.request.submitted', current, gs.getUserID(), gs.getUserName());
    gs.info('BR: Event queued for ' + current.number, 'DEBUG_APPROVAL');

    gs.info('BR: Generate Faculty Approval for Internship Request FINISHED for ' + current.number, 'DEBUG_APPROVAL');

})(current, previous);
