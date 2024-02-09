var theme = JSON.parse(localStorage.getItem("theme") || "") || {
    active: "system",
    primary: "blue",
    secondary: "green",
    background: "zinc"
};

if (theme.active === "system") theme.active = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

document.documentElement.classList.toggle("original", theme.active === "original");
document.documentElement.classList.add(
    theme.active,

    theme.primary || "blue",
    (theme.secondary || "green") + "-2",
    (theme.background || "zinc") + "-bg"
);

document.querySelectorAll("link").forEach((node) => {
    if (!node.rel.endsWith("icon")) return;

    node.href = node.href.replace(/zinc-blue$/, theme.active === "original" ? "original-original" : theme.background + "-" + theme.primary);
});
