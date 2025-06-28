export default function GridItem({
    component: Component,
    data,
    ...props
}: Readonly<{ 
    component: React.ComponentType<any>; 
    data?: any;
} & React.HTMLAttributes<HTMLDivElement>>) {
    return <div {...props}>{<Component post={data} />}</div>;
}