import ReferenceForm from "./components/Form/ReferenceForm";
import Container from "./components/TextEditor/Container";
export default function App() {
  return (
    <main
      key="1"
      className="flex flex-col items-center justify-center min-h-screen py-6 bg-gray-50 dark:bg-gray-900 container"
    >
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Random References Inserter
        </h1>
        <div className="grid grid-cols-2 gap-6">
          <ReferenceForm />
          <div className=" rounded-lg overflow-auto grid gap-6">
            <Container />
          </div>
        </div>
      </div>
    </main>
  );
}
