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
      🎨 Change theme
    </button>
  );
}
