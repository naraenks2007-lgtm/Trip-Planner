<label className="flex items-center cursor-pointer">
  <span className="mr-2 dark:text-white">🌙</span>
  <input
    type="checkbox"
    checked={dark}
    onChange={() => setDark(!dark)}
  />
</label>
