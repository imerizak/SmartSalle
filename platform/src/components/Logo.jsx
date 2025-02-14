export default function Logo({ className = "", size = "normal" }) {
  const sizes = {
    small: "h-8",
    normal: "h-10",
    large: "h-12"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/assets/logo.png" 
        alt="SmartSalle" 
        className={`${sizes[size]} w-auto`}
      />
    </div>
  );
}
