3. Business Rule: Generate HOD Approval for Internship Request
Purpose: Triggers when Internship Request status becomes Waiting for HOD Approval (after insert/update), and creates the HOD approval record.
Table: Internship Request (e.g., x_1729782_internsh_internship_request)
When to run: after insert AND update
Filter Conditions: Status | changes to | Waiting for HOD Approval 
 code:
 (function executeRule(current, previous /*null rule for after rules*/) {

    // Create a new approval record for the HOD
    var grApproval = new GlideRecord('sysapproval_approver');
    grApproval.initialize();
    
    // Set the Approver - IMPORTANT: Use the User ID of your hod.test user (e.g., 'hod.test')
    grApproval.approver = gs.getUserIDByUserName('hod.test'); 
    
    // Link the approval to the Internship Request record
    grApproval.document_id = current.sys_id;
    grApproval.document_table = current.getTableName(); 

    // Set the initial state of the approval record
    grApproval.state = 'requested';

    // Set a short description for the approval task
    // IMPORTANT: Replace 'internship_title' with your exact backend name for Internship Title (e.g., current.internship_title)
    grApproval.short_description = 'Final Approval for Internship Request: ' + current.internship_title; 
    
    // Insert the new approval record
    grApproval.insert();

    // Optionally, add a message to the Internship Request record's Activity stream
    current.comments = 'Final approval requested from HOD.';

})(current, previous);
