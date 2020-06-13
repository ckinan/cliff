package com.ckinan.cliff;

import org.springframework.data.repository.CrudRepository;

public interface AccountRepository extends CrudRepository<AccountEntity, Long> {

    AccountEntity findByUsername(String username);

}
