import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, CreateNote, EditNote } from "../pages";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateNote />} />
      <Route path="/edit/:id" element={<EditNote />} />
    </Routes>
  </BrowserRouter>
);

export default Router;