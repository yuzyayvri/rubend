function rubend_process_cpu_sample(which) {
  if (!Number.isInteger(which) || which < 0 || which > 1) return io_fail(22);
  return io_fail(38);
}

io_eff(CID(sample), rubend_process_cpu_sample);
