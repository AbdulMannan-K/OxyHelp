const capsules = [
    {
        id:1,
        name:'Kapsula C3 / Pesona',
        img:'capsule_one.jpg',
        options: [{text:'R-9',color:'bg-green-400'},{text:'G-9',color:'bg-red-300'}]
    },
    {
        id:2,
        name:'Kapsula I-90 / 1 Person',
        img:'capsule_two.jpg',
        options: [{text:'R-99',color:'bg-yellow-200'},{text:'G-99',color:'bg-red-300'}]
    },
    {
        id:3,
        name:'Kapsula I-90 / 1 Person',
        img:'capsule_three.jpg',
        options: [{text:'R-999',color:'bg-orange-400'},{text:'G-999',color:'bg-red-300'}]
    }
]

function CapsuleInfo (props) {

    return(
        <div className="flex md:flex-col gap-8">
            {
                capsules.map(capsule=>
                    <div
                       className="flex flex-row items-center  bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                        <img
                            className="object-cover w-full rounded-t-lg min-h-full md:h-auto md:w-2/5 md:rounded-none md:rounded-l-lg"
                            src={`${capsule.img}`} alt=""/>
                            <div className="w-80 flex justify-center">
                                <div className="flex justify-center gap-2 ">
                                    {
                                        capsule.options.map(option=>{
                                            return(
                                                <p className={`${option.color} text-3xl  font-bold rounded p-3 font-normal text-gray-700 dark:text-white`}>
                                                    {option.text}
                                                </p>);
                                        })
                                    }
                                </div>
                            </div>
                    </div>
                )
            }
        </div>
    );
}
export {CapsuleInfo,capsules};

// <div className="flex justify-around">
//     {
//         capsules.map((capsule)=>
//             <Card
//                 style={{
//                     width: 300,
//                 }}
//                 cover={
//                     <img
//                         alt="capsule"
//                         src={`${capsule.img}`}
//                     />
//                 }
//                 actions={
//                     capsule.options.map(option=>{
//                         return <p>{`${option}`}</p>
//                     })
//                 }
//             >
//                 <Meta
//                     avatar={<Avatar src="https://joeschmoe.io/api/v1/random"/>}
//                     title="Card title"
//                     description="This is the description"
//                 />
//             </Card>
//         )
//     }
// </div>