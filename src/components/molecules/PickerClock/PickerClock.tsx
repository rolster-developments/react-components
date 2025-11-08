export function RlsPickerClock() {
  return (
    <div className="rls-picker-clock">
      <div className="rls-picker-clock__title">
        <span className="rls-picker-clock__title__hour">12</span>

        <span className="rls-picker-clock__title__minute">:30</span>

        <div className="rls-picker-clock__title__zone">
          <span>AM</span>

          <span>PM</span>
        </div>
      </div>

      <div className="rls-picker-clock__body"></div>

      <div className="rls-picker-clock__footer"></div>
    </div>
  );
}
