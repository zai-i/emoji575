import React, { useEffect, useState } from "react";

export const ThemeToggle = () => {

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("theme")) {
        document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", "yellow");
    }
    else { document
    .getElementsByTagName("HTML")[0]
    .setAttribute("data-theme", localStorage.getItem("theme"));
    }
  },[]);

  const nextTheme = () => {
    const allThemes = ['yellow', 'blue', 'pink', 'purple', 'green']

    setCount(count + 1);

    const theme = allThemes[count % allThemes.length];

    document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    }


  return (
      <button
      type="button"
      className="theme"
      onClick={() => nextTheme()}
    >
      🎨 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABC0lEQVR4nO2VywnCQBCGv1u0AC9qFeKjBfVuC7bi8641iOjBEtKCJNiCoJ4ED4KyMMIQkhgT3SDkg7nszuTf2d38CwUFf8YOqOYh/ADOwDAP4YfE2+5dlXwDDsAMqMfUmLm55N4CgjqOwCCJsA6zZb2Q/D5wiRFLLKxxgBawkcIr0FDzDRkzc2ugKTUvtOgKqJCCpXzAA0oSnowtImo+6jIKLTSW0AsJI3WXQTrAPRBmzAoTdW6ma2tMlbBZhBU6eWy1A+yl05G6XD5Q/qVXL23+To5s5TaBgRiTaWcxEDfC7k5ANyS/J3aa2TLdwCPhy+2txSy2Jrfdz/JIfJOveHUarHapsdplQQGaJwl4jDV/kGPJAAAAAElFTkSuQmCC"/>
    </button>
  );
}
