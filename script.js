const app = {
    init() {
        console.log("init");
        Element.prototype.qs = Element.prototype.querySelector;
        Element.prototype.qsa = Element.prototype.querySelectorAll;
        window.dqs = (e) => document.querySelector(e);
        window.dqsa = (e) => document.querySelectorAll(e);
        window.input.addEventListener("load", (e) => {
            const b64 = e.target.src;
            const [meta, data] = b64.split(",");
            const mime = meta.match(/data:(.*);base64/)[1];

            const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
            const blob = new Blob([bytes], { type: mime });
            const url = URL.createObjectURL(blob);

            window.input.parentElement.style.backgroundImage = `url(${url})`;
        });
        window.output.addEventListener("load", (e) => {
            const b64 = e.target.src;
            const [meta, data] = b64.split(",");
            const mime = meta.match(/data:(.*);base64/)[1];

            const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
            const blob = new Blob([bytes], { type: mime });
            const url = URL.createObjectURL(blob);

            window.output.parentElement.style.backgroundImage = `url(${url})`;
        });
        window.reset.addEventListener("click", (e) => {
            localStorage.clear();
            puter.auth.signIn({
                attempt_temp_user_creation: true,
            });
        });
        app.refreshUsage();
    },
    pick() {
        console.log("pick");
        const picker = Object.assign(document.createElement("input"), {
            type: "file",
            accept: "image/*",
            multiple: false,
        });
        picker.onchange = () => {
            const f = picker.files[0];
            if (!f) return; // no file selected

            const r = new FileReader();
            r.onload = () => {
                console.log(r.result);
                window.input.src = r.result;
            }; // base64 string
            r.readAsDataURL(f);
        };
        picker.click();
    },
    switchImg() {
        console.log("switchimg");
        if (window.output.getAttribute("src") === "") return;
        window.input.src = window.output.src;
        window.output.src = "";
        window.output.parentElement.style.backgroundImage = "";
    },
    downloadImg() {
        console.log("downloadimg");
        const a = document.createElement("a");
        a.href = window.output.src;
        a.download = `${Date.now()}.png`;
        a.click();
    },
    overlay: {
        show() {
            console.log("show");
            document.getElementById("overlay").style.display = "flex";
            // inert on html
            document.documentElement.inert = true;
        },
        hide() {
            console.log("hide");
            document.getElementById("overlay").style.display = "none";
            // inert on html
            document.documentElement.inert = false;
        },
    },
    refreshUsage() {
        if (puter.auth.isSignedIn()) {
            puter.auth.getMonthlyUsage().then((data) => {
                console.log(data.allowanceInfo.remaining);
                console.log(data.allowanceInfo.monthUsageAllowance);

                const usedPercent =
                    ((data.allowanceInfo.monthUsageAllowance -
                        data.allowanceInfo.remaining) /
                        data.allowanceInfo.monthUsageAllowance) *
                    100;
                window.usage.innerHTML = usedPercent.toFixed(2) + "%";
            });
        }
    },
};

document.addEventListener("DOMContentLoaded", (e) => {
    app.init();
});
