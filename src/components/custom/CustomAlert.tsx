import { Terminal } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { ReactNode } from "react";

type CustomAlertInterface = {
    type: "error" | "warning" | "info";
    title: string,
    children: ReactNode,
    hideTitle?: boolean
};

const CustomAlert = ({ type, title, children, hideTitle = false }: CustomAlertInterface) => {
    const colorMap = {
        error: {
            text: "text-red-500",
            border: "border-red-500",
            bg: "bg-red-200",
            icon: "#EF4444"
        },
        warning: {
            text: "text-stone-600",
            border: "border-amber-300",
            bg: "bg-amber-100",
            icon: "#57534E"
        },
        info: {
            text: "text-stone-600",
            border: "border-blue-400",
            bg: "bg-blue-100",
            icon: "#57534E"
        },
    };

    const selectedColor = colorMap[type];

    return (
        <Alert
            className={`${selectedColor.text} ${selectedColor.border} ${selectedColor.bg} tracking-wide`}
        >
            {
                !hideTitle &&
                <>
                    <Terminal color={selectedColor.icon} className="h-4 w-4" />
                    <AlertTitle className="font-semibold text-lg tracking-tight">
                        {title}
                    </AlertTitle>
                </>
            }

            <AlertDescription className={` ${hideTitle ? "" : "mt-2"}  `}>
                {children}
            </AlertDescription>
        </Alert>
    );
};

export default CustomAlert;
