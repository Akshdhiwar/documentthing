import { Cover } from "@/components/ui/cover";

export function GridSmallBackgroundDemo() {
    return (
        <div className=" h-[40rem]  md:h-[46rem] w-full dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex items-center justify-center flex-col">
            {/* Radial gradient for the container to give a faded look */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <span className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Successfully launched DocumentThing v1.0{' '}🥳🎉
            </span>
            <h1 className="text-2xl md:w-9/12  md:text-4xl font-semibold text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
                Effortlessly Create, Collaborate, and Publish Beautiful Code Documentation  at <Cover>warp speed</Cover>
            </h1>
        </div>
    );
}
