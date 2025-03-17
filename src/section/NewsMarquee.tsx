import React from 'react'
import Marquee from 'react-fast-marquee'

const NewsMarquee = () => {
    return (
        <div className="w-full">
            <Marquee 
                className='h-20 border-b-2 border-black block w-full'
                autoFill={true}
            >
               <div>
                <span className="font-medium text-2xl">🚨 BREAKING: </span>
                    <span className="font-medium text-2xl mx-8 text-red-600">AGI achieved in secret lab • </span>
                    <span className="font-medium text-2xl mx-8">🤖 GPT-6 leaks show self-awareness features • </span>
                    <span className="font-medium text-2xl mx-8">⚠️ Elon Musk's Neuralink clones human consciousness • </span>
                    <span className="font-medium text-2xl mx-8">🌐 China bans human programmers by 2030 • </span>
                    <span className="font-medium text-2xl mx-8">💥 DeepMind solves climate change with nanobots • </span>
                    <span className="font-medium text-2xl mx-8">🔮 AI predicts Bitcoin crash to $0 by Friday • </span>
                    <span className="font-medium text-2xl mx-8">⚡ MIT creates AI that reads dreams (FDA approved) • </span>
                    <span className="font-medium text-2xl mx-8">⚠️ WHO warns about AI romance chatbot addiction • </span>
                    <span className="font-medium text-2xl mx-8">👽 Pentagon's AI reverse-engineered alien tech • </span>
               </div>
            </Marquee>
        </div>
    )
}

export default NewsMarquee;
