import {useState} from "react"

function App() {
  const [form, setForm] = useState({prompt: '', size: '256x256', number: '1'})
  const [images, setImages] = useState([])

  async function generateImages(e) {
    e.preventDefault()
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
        },
        body: JSON.stringify({
          prompt: form.prompt,
          n: Number(form.number),
          size: form.size,
        })
      })
      const data = await response.json()
      setImages([...data.data])
    } catch (e) {
      console.log(e.message);
    }
  }

  return (
    <div className="container w-50 pt-5">
      <h1 className="text-center">Image Generator</h1>

      <form onSubmit={(e) =>generateImages(e)}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter img params"
          required
          value={form.prompt}
          onChange={(e) => setForm({...form, prompt: e.target.value})}
        />
        <select
          className="form-control mb-2"
          value={form.size}
          onChange={(e)=> setForm({...form, size: e.target.value})}>
          <option value="256x256">Small</option>
          <option value="512x512">Medium</option>
          <option value="1024x1024">Large</option>
        </select>
        <input
          type="number"
          className="form-control mb-2"
          required
          value={form.number}
          onChange={(e) => setForm({...form, number: e.target.value})}
        />
        <button className="btn btn-primary w-100">Generate</button>
      </form>

      <div className="images-block">
        {images.length > 0 &&
        <div className="images">
          {images.map((image, index) =>
            <img key={index} src={image.url} alt="image-ai" className="image-card"/>
          )}
        </div>
        }
      </div>
    </div>
  )
}

export default App
