import ReferenceForm from "@/components/Form/ReferenceForm";
import Container from "@/components/TextEditor/Container";

const HomePage = () => {
  return (
    <div className="w-full">
      {" "}
      <div className="grid grid-cols-2 gap-6">
        <ReferenceForm />
        <div className=" rounded-lg overflow-auto grid gap-6">
          <Container />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
