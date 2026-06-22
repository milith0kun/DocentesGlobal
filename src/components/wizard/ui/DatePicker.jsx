'use client';

export default function DatePicker({
  fechaNacimiento,
  showDatePicker,
  setShowDatePicker,
  viewYear,
  setViewYear,
  viewMonth,
  setViewMonth,
  calendarView,
  setCalendarView,
  onSelectDate,
  onOpen,
}) {
  return (
    <div className="wz-datepicker-container" style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        placeholder="DD/MM/AAAA"
        value={fechaNacimiento}
        readOnly
        onClick={onOpen}
        onFocus={onOpen}
        className="wz-input"
        maxLength={10}
        autoComplete="off"
        style={{ paddingRight: '2.5rem', cursor: 'pointer' }}
      />

      <button
        type="button"
        onClick={onOpen}
        className="wz-datepicker-input-icon"
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: 0,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </button>

      {showDatePicker && (
        <>
          <div className="wz-datepicker-overlay" onClick={() => setShowDatePicker(false)} />
          <div className="wz-datepicker-popover">

            {/* VISTA 1: SELECCIONAR AÑO */}
            {calendarView === 'year' && (
              <div className="wz-datepicker-view-year">
                <div className="wz-datepicker-view-title">Selecciona tu Año de Nacimiento</div>
                <div className="wz-datepicker-years-grid">
                  {Array.from({ length: new Date().getFullYear() - 1939 }, (_, i) => 1940 + i)
                    .reverse()
                    .map((y) => (
                      <button
                        key={y}
                        type="button"
                        className={`wz-datepicker-year-btn ${y === viewYear ? 'selected' : ''}`}
                        onClick={() => {
                          setViewYear(y);
                          setCalendarView('month');
                        }}
                      >
                        {y}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* VISTA 2: SELECCIONAR MES */}
            {calendarView === 'month' && (
              <div className="wz-datepicker-view-month">
                <div className="wz-datepicker-view-header">
                  <button
                    type="button"
                    className="wz-datepicker-back-btn"
                    onClick={() => setCalendarView('year')}
                  >
                    ← Año {viewYear}
                  </button>
                  <div className="wz-datepicker-view-title">Selecciona el Mes</div>
                </div>
                <div className="wz-datepicker-months-grid">
                  {[
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
                  ].map((m, idx) => (
                    <button
                      key={m}
                      type="button"
                      className={`wz-datepicker-month-btn ${idx === viewMonth ? 'selected' : ''}`}
                      onClick={() => {
                        setViewMonth(idx);
                        setCalendarView('day');
                      }}
                    >
                      {m.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* VISTA 3: SELECCIONAR DÍA */}
            {calendarView === 'day' && (
              <div className="wz-datepicker-view-day">
                <div className="wz-datepicker-header">
                  <button
                    type="button"
                    className="wz-datepicker-nav-btn"
                    onClick={() => {
                      if (viewMonth === 0) {
                        setViewMonth(11);
                        setViewYear((prev) => prev - 1);
                      } else {
                        setViewMonth((prev) => prev - 1);
                      }
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>

                  <div className="wz-datepicker-header-label">
                    <button
                      type="button"
                      className="wz-datepicker-label-btn"
                      onClick={() => setCalendarView('month')}
                    >
                      {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][viewMonth]}
                    </button>
                    <button
                      type="button"
                      className="wz-datepicker-label-btn"
                      onClick={() => setCalendarView('year')}
                    >
                      {viewYear}
                    </button>
                  </div>

                  <button
                    type="button"
                    className="wz-datepicker-nav-btn"
                    onClick={() => {
                      if (viewMonth === 11) {
                        setViewMonth(0);
                        setViewYear((prev) => prev + 1);
                      } else {
                        setViewMonth((prev) => prev + 1);
                      }
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>

                <div className="wz-datepicker-grid">
                  {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map((d) => (
                    <span key={d} className="wz-datepicker-weekday">
                      {d}
                    </span>
                  ))}
                  {(() => {
                    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
                    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
                    const startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
                    const cells = [];

                    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
                    for (let i = startDay - 1; i >= 0; i--) {
                      cells.push({ day: prevMonthDays - i, isCurrent: false, offset: -1 });
                    }
                    for (let i = 1; i <= daysInMonth; i++) {
                      cells.push({ day: i, isCurrent: true, offset: 0 });
                    }
                    const totalCells = Math.ceil(cells.length / 7) * 7;
                    for (let i = 1; i <= totalCells - cells.length; i++) {
                      cells.push({ day: i, isCurrent: false, offset: 1 });
                    }

                    return cells.map((cell, idx) => {
                      let isSelected = false;
                      if (fechaNacimiento) {
                        const partes = fechaNacimiento.split('/');
                        if (partes.length === 3) {
                          const selD = Number(partes[0]);
                          const selM = Number(partes[1]) - 1;
                          const selY = Number(partes[2]);
                          let targetMonth = viewMonth + cell.offset;
                          let targetYear = viewYear;
                          if (targetMonth < 0) { targetMonth = 11; targetYear -= 1; }
                          else if (targetMonth > 11) { targetMonth = 0; targetYear += 1; }
                          isSelected = selD === cell.day && selM === targetMonth && selY === targetYear;
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            let targetMonth = viewMonth + cell.offset;
                            let targetYear = viewYear;
                            if (targetMonth < 0) { targetMonth = 11; targetYear -= 1; }
                            else if (targetMonth > 11) { targetMonth = 0; targetYear += 1; }
                            const dd = String(cell.day).padStart(2, '0');
                            const mm = String(targetMonth + 1).padStart(2, '0');
                            onSelectDate(`${dd}/${mm}/${targetYear}`);
                            setShowDatePicker(false);
                          }}
                          className={`wz-datepicker-day ${cell.isCurrent ? 'current' : 'adjacent'} ${isSelected ? 'selected' : ''}`}
                        >
                          {cell.day}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
