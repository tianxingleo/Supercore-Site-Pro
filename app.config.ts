export default defineAppConfig({
    ui: {
        primary: 'black',
        gray: 'neutral',
        button: {
            default: {
                loadingIcon: 'i-heroicons-arrow-path-20-solid'
            },
            padding: {
                sm: 'px-3 py-1.5',
                md: 'px-6 py-3',
                lg: 'px-8 py-4'
            },
            rounded: 'rounded-none',
            font: 'font-bold',
            transition: 'transition-all duration-300 ease-out',
            variant: {
                solid: 'bg-{color}-500 dark:bg-{color}-400 text-white hover:bg-{color}-600 dark:hover:bg-{color}-500 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]',
                outline: 'ring-1 ring-inset ring-{color}-500 dark:ring-{color}-400 text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 hover:dark:bg-{color}-900/10 hover:-translate-y-0.5 active:scale-[0.98]',
                ghost: 'text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 dark:hover:bg-{color}-900/10 hover:-translate-y-0.5 active:scale-[0.98]',
                link: 'text-{color}-500 dark:text-{color}-400 underline-offset-4 hover:underline active:scale-[0.95]'
            },
            // Special override for black color to maintain Swiss aesthetic
            color: {
                black: {
                    solid: 'bg-black text-white hover:bg-gray-900 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300',
                    ghost: 'text-black hover:bg-gray-100 hover:-translate-y-0.5 active:scale-[0.98]'
                }
            }
        },
        input: {
            rounded: 'rounded-none',
            variant: {
                outline: 'bg-white border-gray-200 focus:border-black focus:ring-0 active:ring-0'
            }
        },
        card: {
            rounded: 'rounded-none',
            shadow: 'shadow-none',
            border: 'border border-gray-100'
        }
    }
})
