Each service category has its own booking logic and time rules.

2. Skin Booking Logic
2.1 Fixed Time Slots (Skin)

Skin appointments use fixed daily time slots:

08:30

10:00

11:30

13:00 (1:00 PM)

15:00 (3:00 PM)

These are the standard booking times for Skin.

2.2 Booking UI for Skin

When Skin is selected:

The booking UI should show a list of fixed time slots:

08:30, 10:00, 11:30, 13:00, 15:00

Custom Time (Skin) – Admin Only

There must be an additional option: “Custom time” (start + end), but:

This option is only available for Admin users.

Non-admin users can only select from the fixed time slots.

Admin custom time:

Admin can set any custom start time and end time for a Skin booking.

Example: from 13:00 to 15:00 (2 hours), even if the usual slot is shorter.

2.3 Admin Permissions for Skin

Admin should be able to:

Create Skin bookings using:

Fixed slots or

Custom time (admin-only).

Edit existing Skin bookings:

Change start time and end time to any valid time.

Create internal/admin-only blocks if needed:

These might not be visible to normal users until linked to a real client (depending on product design).

3. Laser Booking Logic

Laser bookings are more flexible and depend on session duration.

3.1 Session Durations (Laser)

Laser sessions can have different durations, such as:

15 minutes

30 minutes

40 minutes

45 minutes

60 minutes (1 hour)

90 minutes (1.5 hours)

120 minutes (2 hours)

These durations should ideally be configurable (stored in config or database).

3.2 Start Time Selection (Laser)

Laser booking time is chosen using Hour + Minutes.

Hours Dropdown

Available hours:

8, 9, 10, 11, 12, 13, 14, 15, 16

(24h format recommended in the backend; UI can show 12h or 24h.)

Minutes Dropdown

Available minutes:

00

15

30

45

This means start time is always in steps of 15 minutes
(e.g., 09:00, 09:15, 09:30, 09:45, etc.).

3.3 Forbidden Start Times (Laser)

For Laser, the following times must not be allowed as a session start time:

08:00

08:30

16:30

So:

These times should not appear in the selectable options, or

If somehow selected, the backend must reject the booking.

3.4 End-of-Day Constraint (Laser)

The maximum allowed end time for any Laser session is 16:30 (4:30 PM).

Rule:

If session_end_time > 16:30 → the booking must be rejected.

Example:

2-hour session starting at 14:00 → ends at 16:00 ✅ allowed

2-hour session starting at 15:00 → ends at 17:00 ❌ not allowed

2-hour session starting at 14:30 → ends at 16:30

This is on the limit; should be treated as allowed if the rule is “must not end after 16:30”.

Implementation detail for the agent:

if (end_time > 16:30) → invalid booking

3.5 Limit per Time (Overbooking Protection)

For Laser, there is a maximum number of simultaneous sessions (limit) allowed for overlapping time ranges.

Before confirming a booking, the system must:

Compute the time range of the new session:

start_time and end_time = start_time + duration

Check all existing Laser bookings that overlap with this time range.

If the count of overlapping bookings ≥ limit:

The system must block the booking.

The user should not be allowed to proceed from Step 2 to Step 3 in the booking flow.

The limit value should be configurable.

4. Booking Flow & Validation

Assume a multi-step booking flow (e.g., Step 1: service, Step 2: time, Step 3: confirmation).

4.1 Service Selection (Step 1)

User/Admin chooses:

Skin or Laser

4.2 Time Selection (Step 2)

Based on service:

If Skin:

Show fixed slots (always).

If user is Admin:

Also show Custom Time fields (start & end).

If Laser:

Show:

Duration selector (15, 30, 40, 45, 60, 90, 120 minutes, etc.)

Hour dropdown (8–16)

Minute dropdown (00, 15, 30, 45)

4.3 Validation Before Going to Step 3 (Confirm)

The system must validate all rules before letting the user proceed to Step 3:

For Skin

Fixed slot:

Check that the slot is not already overbooked (if you have a limit).

Custom time (Admin only):

Optional: check conflicts if required by business logic.

For Laser

Forbidden start times

Start time must not be:

08:00, 08:30, 16:30

End-of-day rule

end_time must not be later than 16:30.

Limit / overlapping sessions

Count overlapping Laser bookings in the selected range.

If count ≥ limit → reject and keep user in Step 2.

If any check fails:

Do not allow navigation to Step 3.

Show a clear error message (e.g., “Selected time is not available” or “Session would end after 16:30”).