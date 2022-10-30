import { useLayoutEffect } from "react";

type TabsProps = {
  information: { title: string; description: string }[];
};

export const Tabs = ({ information }: TabsProps) => {
  useLayoutEffect(() => {
    let tabs = [...document.querySelectorAll(".tabs__item")];
    let panels = [...document.querySelectorAll(".panels__item")];
    document.getElementById("tabs")!.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.target as any;
      if (target.classList.contains("tabs__item")) {
        let position = tabs.indexOf(target);
        tabs.forEach((tab) => tab.classList.remove("active"));
        panels.forEach((panel) => panel.classList.remove("active"));
        tabs[position].classList.add("active");
        panels[position].classList.add("active");
      }
    });
  }, [information]);

  return (
    <div className="tabs-container">
      <ul className="tabs" id="tabs">
        {information.map((info, index) => (
          <li
            className={`tabs__item ${index == 0 ? "active" : ""}`}
            key={index}
            id="tab-1"
          >
            {info.title}
          </li>
        ))}
      </ul>
      <div className="panels h-[319px] overflow-y-auto overflow-x-hidden">
        {information.map((info, index) => (
          <pre
            className={`panels__item ${index == 0 ? "active" : ""} text-[14px]`}
            key={index}
            id="tab-1"
          >
            {info.description}
          </pre>
        ))}
      </div>
    </div>
  );
};
