const FormInput = ({ label, type, register, required }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium">{label}</label>
      <input
        type={type}
        {...register(label, { required })}
        className="border p-2 rounded w-full"
      />
    </div>
  );
};

export default FormInput;
