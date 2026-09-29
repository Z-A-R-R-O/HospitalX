export default function InternalLoading() {
  return (
    <div className="hx-internal-loader" role="status" aria-live="polite" aria-label="Loading HospitalX">
      <div className="hx-internal-loader-mark" aria-hidden="true"><i /><i /></div>
      <p>HospitalX</p>
      <span>Preparing your workspace</span>
      <div className="hx-internal-loader-bars" aria-hidden="true"><i /><i /><i /><i /></div>
    </div>
  );
}
