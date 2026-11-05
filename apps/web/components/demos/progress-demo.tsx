"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/craft/progress";

export function ProgressDemo() {
  const [value, setValue] = useState(20);

  useEffect(() => {
    const timer = setInterval(
      () => setValue((current) => (current >= 100 ? 0 : current + 10)),
      900
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-md">
      <Progress label="Downloading pack" showValue value={value} />
    </div>
  );
}
