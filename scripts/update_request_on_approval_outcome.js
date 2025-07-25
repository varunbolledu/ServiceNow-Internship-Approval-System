2. Business Rule: Update Internship Request on Approval Outcome
Purpose: Triggers when any sysapproval_approver record (Faculty or HOD) is approved/rejected, and updates the Internship Request status accordingly.
Table: Approval (sysapproval_approver)
When to run: after update
Filter Conditions:State | changes to | Approved
  OR
State | changes to | Rejected

  code:
  (function executeRule(current, previous /*null rule for after rules*/) {

    // Get the Internship Request record that this approval is for
    // IMPORTANT: Replace 'x_1729782_internsh_internship_request' with your exact Internship Request table name
    var grRequest = new GlideRecord('x_1729782_internsh_internship_request'); 
    if (grRequest.get(current.document_id)) { // current.document_id holds the sys_id of your Internship Request

        // Check if this approval is from the Faculty (using their User ID)
        // IMPORTANT: Replace 'faculty.test' with your faculty.test User ID
        var facultySysId = gs.getUserIDByUserName('faculty.test'); 

        // Check if this approval is from the HOD (using their User ID)
        // IMPORTANT: Replace 'hod.test' with your hod.test User ID
        var hodSysId = gs.getUserIDByUserName('hod.test'); 

        if (current.approver == facultySysId) {
            // This is a Faculty approval/rejection
            if (current.state == 'approved') {
                grRequest.status = 'waiting_hod_approval'; // Faculty approved, move to HOD approval stage
                gs.info("Internship Request " + grRequest.number + " Approved by Faculty, now Waiting for HOD Approval.");
            } else if (current.state == 'rejected') {
                grRequest.status = 'Rejected'; // Faculty rejected, final rejection
                gs.info("Internship Request " + grRequest.number + " Rejected by Faculty.");
            }
        } else if (current.approver == hodSysId) {
            // This is an HOD approval/rejection
            if (current.state == 'approved') {
                grRequest.status = 'Approved'; // HOD approved, final approval
                gs.info("Internship Request " + grRequest.number + " Fully Approved by HOD.");
            } else if (current.state == 'rejected') {
                grRequest.status = 'Rejected'; // HOD rejected, final rejection
                gs.info("Internship Request " + grRequest.number + " Rejected by HOD.");
            }
        }
        grRequest.update(); // Save the changes to the Internship Request record

    }

})(current, previous);
