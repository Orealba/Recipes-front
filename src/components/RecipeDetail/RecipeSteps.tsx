interface InstructionStepImage {
  local_image_name: string;
}

interface InstructionStep {
  index: number;
  instructions: string;
  images?: InstructionStepImage[];
}

interface RecipeStepsProps {
  steps: InstructionStep[];
}

export function RecipeSteps({ steps }: RecipeStepsProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">Pasos</h2>
      
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#c45a36] text-white font-medium flex items-center justify-center">
              {step.index}
            </span>
            {step.images && step.images[0] && (
              <img
                src={`/hellofresh_images/${step.images[0].local_image_name}`}
                alt={`Paso ${step.index}`}
                className="hidden md:block w-52 h-52 object-cover rounded-lg flex-shrink-0"
              />
            )}
            <div 
              className="text-gray-700 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: step.instructions }}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}