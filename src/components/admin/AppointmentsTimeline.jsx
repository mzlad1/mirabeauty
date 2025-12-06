import React, { useMemo } from "react";
import "./AppointmentsTimeline.css";

const AppointmentsTimeline = ({
  appointments,
  selectedDate,
  onAppointmentClick,
}) => {
  // Generate time slots (8:00 AM to 4:30 PM in 30-minute intervals)
  const timeSlots = useMemo(() => {
    const slots = [];
    // From 8:00 AM to 4:30 PM in 30-minute intervals
    for (let hour = 8; hour <= 16; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < 16) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }
    // Add 4:30 PM
    slots.push("16:30");
    return slots;
  }, []);

  // Filter appointments for the selected date
  const filteredAppointments = useMemo(() => {
    if (!selectedDate) return [];
    return appointments.filter((apt) => apt.date === selectedDate);
  }, [appointments, selectedDate]);

  // Get status color class
  const getStatusColor = (status) => {
    switch (status) {
      case "مؤكد":
        return "timeline-confirmed";
      case "في الانتظار":
        return "timeline-pending";
      case "مكتمل":
        return "timeline-completed";
      case "ملغي":
        return "timeline-cancelled";
      default:
        return "";
    }
  };

  // Parse time string to get hour and minute
  const parseTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    return { hour, minute };
  };

  // Calculate position percentage for appointment within the timeline
  const getAppointmentPosition = (time) => {
    const { hour, minute } = parseTime(time);
    // Timeline starts at 8 AM (hour 8) and goes to 4:30 PM (hour 16:30)
    const startHour = 8;
    const totalHours = 8.5; // 8 AM to 4:30 PM = 8.5 hours
    const hoursSinceStart = hour - startHour + minute / 60;
    return (hoursSinceStart / totalHours) * 100;
  };

  // Calculate width percentage based on duration
  const getAppointmentWidth = (duration) => {
    const totalMinutes = 8.5 * 60; // 8 AM to 4:30 PM = 510 minutes
    return (duration / totalMinutes) * 100;
  };

  // Group appointments by time for better visualization
  const groupedAppointments = useMemo(() => {
    const grouped = {};
    filteredAppointments.forEach((apt) => {
      if (!grouped[apt.time]) {
        grouped[apt.time] = [];
      }
      grouped[apt.time].push(apt);
    });
    return grouped;
  }, [filteredAppointments]);

  if (!selectedDate) {
    return (
      <div className="appointments-timeline">
        <div className="timeline-empty">
          <i className="fas fa-calendar-day"></i>
          <p>اختر تاريخاً لعرض جدول المواعيد</p>
        </div>
      </div>
    );
  }

  if (filteredAppointments.length === 0) {
    return (
      <div className="appointments-timeline">
        <div className="timeline-empty">
          <i className="fas fa-calendar-times"></i>
          <p>لا توجد مواعيد في {selectedDate}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-timeline">
      <div className="timeline-header">
        <div className="timeline-date">
          <i className="fas fa-calendar-day"></i>
          <h3>جدول المواعيد - {selectedDate}</h3>
        </div>
        <div className="timeline-count">
          <span>{filteredAppointments.length} موعد</span>
        </div>
      </div>

      <div className="timeline-container">
        {/* Time axis */}
        <div className="timeline-axis">
          {timeSlots.map((slot) => {
            const position = getAppointmentPosition(slot);
            return (
              <div
                key={slot}
                className="timeline-time-slot"
                style={{ right: `${position}%` }}
              >
                <span className="time-label">{slot}</span>
                <div className="time-marker"></div>
              </div>
            );
          })}
        </div>

        {/* Appointments track */}
        <div className="timeline-track">
          {filteredAppointments.map((appointment, index) => {
            const startPosition = getAppointmentPosition(appointment.time);
            // Get duration from serviceDuration field or default to 30
            const duration =
              appointment.serviceDuration || appointment.duration || 30;
            const width = getAppointmentWidth(duration);

            // Calculate how many appointments at the same time slot (for stacking)
            const sameTimeAppts = filteredAppointments.filter(
              (apt) => apt.time === appointment.time
            );
            const stackIndex = sameTimeAppts.findIndex(
              (apt) => apt.id === appointment.id
            );

            return (
              <div
                key={appointment.id}
                className={`timeline-appointment ${getStatusColor(
                  appointment.status
                )}`}
                onClick={() =>
                  onAppointmentClick && onAppointmentClick(appointment)
                }
                style={{
                  right: `${startPosition}%`,
                  width: `${width}%`,
                  top: `${stackIndex * 60}px`,
                }}
                title={`${appointment.time} - ${appointment.customerName} - ${appointment.serviceName} (${duration} دقيقة)`}
              >
                <div className="appointment-compact">
                  <div className="appointment-time-compact">
                    {appointment.time}
                  </div>
                  <div className="appointment-name-compact">
                    {appointment.customerName}
                  </div>
                  <div
                    className={`appointment-status-compact ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="timeline-legend">
        <div className="legend-item">
          <span className="legend-color timeline-pending"></span>
          <span>في الانتظار</span>
        </div>
        <div className="legend-item">
          <span className="legend-color timeline-confirmed"></span>
          <span>مؤكد</span>
        </div>
        <div className="legend-item">
          <span className="legend-color timeline-completed"></span>
          <span>مكتمل</span>
        </div>
        <div className="legend-item">
          <span className="legend-color timeline-cancelled"></span>
          <span>ملغي</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsTimeline;
